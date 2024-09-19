<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Http\Requests\InvoiceRequest;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with('client', 'project')->get();
        return response()->json($invoices);
    }

    public function store(InvoiceRequest $request)
    {
        $invoice = Invoice::create($request->validated());

        return response()->json([
            'message' => 'Invoice created successfully.',
            'invoice' => $invoice,
        ], 201);
    }

    public function show(Invoice $invoice)
    {
        return response()->json($invoice->load('client', 'project'));
    }

    public function update(InvoiceRequest $request, Invoice $invoice)
    {
        $invoice->update($request->validated());

        return response()->json([
            'message' => 'Invoice updated successfully.',
            'invoice' => $invoice,
        ]);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return response()->json([
            'message' => 'Invoice deleted successfully.',
        ]);
    }
}
