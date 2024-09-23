<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentRequest;
use App\Models\Payment;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Instantiate a new controller instance.
     *
     * Apply authentication middleware to all routes in this controller.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the payments.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
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

        return response()->json($payments);
    }

    /**
     * Store a newly created payment in storage.
     *
     * Any authenticated user can create a payment.
     *
     * @param  \App\Http\Requests\PaymentRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(PaymentRequest $request)
    {
        $payment = Payment::create($request->validated());

        return response()->json([
            'message' => 'Payment created successfully.',
            'payment' => $payment,
        ], 201);
    }

    /**
     * Display the specified payment.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Payment $payment)
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations') || $payment->user_id === $user->id) {
            // Admins and Developers can view any payment
            // Clients can view their own payments
            return response()->json($payment->load(['user', 'invoice']));
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
    public function update(PaymentRequest $request, Payment $payment)
    {
        // Only Admins and Developers can update payments
        Gate::authorize('perform-crud-operations');

        $payment->update($request->validated());

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
    public function destroy(Payment $payment)
    {
        // Only Admins and Developers can delete payments
        Gate::authorize('perform-crud-operations');

        $payment->delete();

        return response()->json([
            'message' => 'Payment deleted successfully.',
        ]);
    }
}
