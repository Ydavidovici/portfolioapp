<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Http\Requests\InvoiceRequest;
use Illuminate\Support\Facades\Gate;

class InvoiceController extends Controller
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
     * Display a listing of the invoices.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations')) {
            // Admins and Developers can view all invoices
            $invoices = Invoice::with(['client', 'project'])->get();
        } elseif (Gate::allows('manage-client-things')) {
            // Clients can view only their own invoices
            $invoices = Invoice::with(['client', 'project'])
                ->where('client_id', $user->id)
                ->get();
        } else {
            // Other roles (if any) cannot view invoices
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        return response()->json($invoices);
    }

    /**
     * Store a newly created invoice in storage.
     *
     * @param  \App\Http\Requests\InvoiceRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(InvoiceRequest $request)
    {
        // Only Admins and Developers can create invoices
        Gate::authorize('perform-crud-operations');

        $invoice = Invoice::create($request->validated());

        return response()->json([
            'message' => 'Invoice created successfully.',
            'invoice' => $invoice,
        ], 201);
    }

    /**
     * Display the specified invoice.
     *
     * @param  \App\Models\Invoice  $invoice
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Invoice $invoice)
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations') || ($invoice->client_id === $user->id && Gate::allows('manage-client-things'))) {
            // Admins and Developers can view any invoice
            // Clients can view their own invoices
            return response()->json($invoice->load(['client', 'project']));
        }

        // Unauthorized access
        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }

    /**
     * Update the specified invoice in storage.
     *
     * @param  \App\Http\Requests\InvoiceRequest  $request
     * @param  \App\Models\Invoice  $invoice
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(InvoiceRequest $request, Invoice $invoice)
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations') || ($invoice->client_id === $user->id && Gate::allows('manage-client-things'))) {
            // Admins and Developers can update any invoice
            // Clients can update (e.g., pay) their own invoices
            $invoice->update($request->validated());

            return response()->json([
                'message' => 'Invoice updated successfully.',
                'invoice' => $invoice,
            ]);
        }

        // Unauthorized access
        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }

    /**
     * Remove the specified invoice from storage.
     *
     * @param  \App\Models\Invoice  $invoice
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Invoice $invoice)
    {
        // Only Admins and Developers can delete invoices
        Gate::authorize('perform-crud-operations');

        $invoice->delete();

        return response()->json([
            'message' => 'Invoice deleted successfully.',
        ]);
    }
}
