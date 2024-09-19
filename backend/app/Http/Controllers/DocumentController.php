<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Http\Requests\DocumentRequest;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::with('project', 'uploadedBy')->get();
        return response()->json($documents);
    }

    public function store(DocumentRequest $request)
    {
        $document = Document::create($request->validated());

        return response()->json([
            'message' => 'Document uploaded successfully.',
            'document' => $document,
        ], 201);
    }

    public function show(Document $document)
    {
        return response()->json($document->load('project', 'uploadedBy'));
    }

    public function update(DocumentRequest $request, Document $document)
    {
        $document->update($request->validated());

        return response()->json([
            'message' => 'Document updated successfully.',
            'document' => $document,
        ]);
    }

    public function destroy(Document $document)
    {
        $document->delete();

        return response()->json([
            'message' => 'Document deleted successfully.',
        ]);
    }
}
