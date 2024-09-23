<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Http\Requests\DocumentRequest;
use Illuminate\Support\Facades\Gate;

class DocumentController extends Controller
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
     * Display a listing of the documents.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = auth()->user();

        if (Gate::allows('access-admin-dashboard')) {
            // Admins can view all documents
            $documents = Document::with(['project', 'uploadedBy'])->get();
        } elseif (Gate::allows('manage-client-things')) {
            // Clients can view only their own documents
            $documents = Document::with(['project', 'uploadedBy'])
                ->where('uploaded_by', $user->id)
                ->get();
        } else {
            // Other roles (if any) cannot view documents
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        return response()->json($documents);
    }

    /**
     * Store a newly created document in storage.
     *
     * @param  \App\Http\Requests\DocumentRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(DocumentRequest $request)
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations') || Gate::allows('manage-client-things')) {
            $documentData = $request->validated();
            $documentData['uploaded_by'] = $user->id; // Assuming 'uploaded_by' is the foreign key

            $document = Document::create($documentData);

            return response()->json([
                'message' => 'Document uploaded successfully.',
                'document' => $document,
            ], 201);
        }

        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }

    /**
     * Display the specified document.
     *
     * @param  \App\Models\Document  $document
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Document $document)
    {
        $user = auth()->user();

        if (Gate::allows('access-admin-dashboard') || ($document->uploaded_by === $user->id && Gate::allows('manage-client-things'))) {
            return response()->json($document->load(['project', 'uploadedBy']));
        }

        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }

    /**
     * Update the specified document in storage.
     *
     * @param  \App\Http\Requests\DocumentRequest  $request
     * @param  \App\Models\Document  $document
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(DocumentRequest $request, Document $document)
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations') || ($document->uploaded_by === $user->id && Gate::allows('manage-client-things'))) {
            $document->update($request->validated());

            return response()->json([
                'message' => 'Document updated successfully.',
                'document' => $document,
            ]);
        }

        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }

    /**
     * Remove the specified document from storage.
     *
     * @param  \App\Models\Document  $document
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Document $document)
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations') || ($document->uploaded_by === $user->id && Gate::allows('manage-client-things'))) {
            $document->delete();

            return response()->json([
                'message' => 'Document deleted successfully.',
            ]);
        }

        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }
}
