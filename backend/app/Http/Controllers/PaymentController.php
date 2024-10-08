<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentRequest;
use App\Models\Payment;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\JsonResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    /**
     * Instantiate a new controller instance.
     *
     * Applies authentication middleware to all methods.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the payments.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations')) {
            // Admins and Developers can view all payments
            $payments = Payment::with(['user', 'invoice'])->get();
        } else {
            // Clients can view only their own payments
            $payments = Payment::with(['user', 'invoice'])
                ->where('user_id', $user->id)
                ->get();
        }

        return response()->json(['payments' => $payments]);
    }

    /**
     * Store a newly created payment in storage.
     *
     * Any authenticated user (Admins, Developers, Clients) can create a payment.
     *
     * @param  \App\Http\Requests\PaymentRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(PaymentRequest $request): JsonResponse
    {
        $user = auth()->user();

        // Authorize using existing gates
        if (!Gate::allows('perform-crud-operations') && !Gate::allows('manage-client-things')) {
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        $validated = $request->validated();

        try {
            // Set Stripe API key
            Stripe::setApiKey(config('services.stripe.secret'));

            // Create a PaymentIntent directly
            $paymentIntent = PaymentIntent::create([
                'amount' => intval($validated['amount'] * 100), // Amount in cents
                'currency' => config('services.stripe.currency'), // Use configured currency
                'payment_method' => $validated['payment_method'], // Payment method ID from frontend
                'confirmation_method' => 'manual',
                'confirm' => true,
                'metadata' => [
                    'user_id' => $user->id,
                    'invoice_id' => $validated['invoice_id'],
                ],
            ]);

            // Handle different payment statuses
            if (
                $paymentIntent->status === 'requires_action' &&
                isset($paymentIntent->next_action->type) &&
                $paymentIntent->next_action->type === 'use_stripe_sdk'
            ) {
                // Payment requires additional actions (e.g., 3D Secure)
                return response()->json([
                    'message' => 'Payment requires additional action.',
                    'requires_action' => true,
                    'payment_intent_client_secret' => $paymentIntent->client_secret,
                ]);
            } elseif ($paymentIntent->status === 'succeeded') {
                // Payment succeeded, create a Payment record
                $payment = Payment::create([
                    'user_id' => $user->id,
                    'invoice_id' => $validated['invoice_id'],
                    'amount' => $validated['amount'],
                    'payment_date' => now(),
                    'payment_method' => $validated['payment_method'],
                    'stripe_payment_intent_id' => $paymentIntent->id,
                    'status' => 'succeeded',
                ]);

                return response()->json([
                    'message' => 'Payment successful.',
                    'payment' => $payment,
                ], 201);
            } else {
                // Invalid status
                return response()->json([
                    'message' => 'Invalid PaymentIntent status.',
                ], 500);
            }
        } catch (\Exception $e) {
            // Handle exceptions and return appropriate responses
            return response()->json([
                'message' => 'Payment failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified payment.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Payment $payment): JsonResponse
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations') || $payment->user_id === $user->id) {
            // Admins and Developers can view any payment
            // Clients can view their own payments
            return response()->json(['payment' => $payment->load(['user', 'invoice'])]);
        }

        // Unauthorized access
        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }

    /**
     * Update the specified payment in storage.
     *
     * Only Admins and Developers can update payments.
     *
     * @param  \App\Http\Requests\PaymentRequest  $request
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(PaymentRequest $request, Payment $payment): JsonResponse
    {
        try {
            // Only Admins and Developers can update payments
            Gate::authorize('perform-crud-operations');
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        $validated = $request->validated();

        // Optionally, handle updating Stripe PaymentIntent if necessary
        // For simplicity, assuming only local record is updated

        $payment->update($validated);

        return response()->json([
            'message' => 'Payment updated successfully.',
            'payment' => $payment,
        ]);
    }

    /**
     * Remove the specified payment from storage.
     *
     * Only Admins and Developers can delete payments.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Payment $payment): JsonResponse
    {
        try {
            // Only Admins and Developers can delete payments
            Gate::authorize('perform-crud-operations');
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        // Optionally, handle refunds via Stripe before deleting
        // ...

        $payment->delete();

        return response()->json([
            'message' => 'Payment deleted successfully.',
        ]);
    }
}
