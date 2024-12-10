import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Database, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '../lib/store';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, getDocs } from 'firebase/firestore';

export default function FirebaseStatus() {
  const { isOnline, user, isAdmin } = useStore();
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runConnectionTest = async () => {
    setTestStatus('testing');
    setErrorMessage(null);

    try {
      // Test collection
      const testCollectionRef = collection(db, '_test_connection');
      
      // Test write
      const docRef = await addDoc(testCollectionRef, {
        timestamp: new Date().toISOString(),
        test: true
      });

      // Test read
      const querySnapshot = await getDocs(testCollectionRef);
      
      // Test delete
      await deleteDoc(docRef);

      setTestStatus('success');
    } catch (error: any) {
      console.error('Firebase test failed:', error);
      setTestStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="text-lg font-semibold mb-4">Firebase Status</h3>
      
      <div className="space-y-3">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          <span>Connection: {isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Database Status */}
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-500" />
          <span>Database: {db ? 'Initialized' : 'Not Initialized'}</span>
        </div>

        {/* Auth Status */}
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-500" />
          <span>Auth: {user ? `Logged in as ${user.email}` : 'Not logged in'}</span>
        </div>

        {/* Admin Status */}
        {user && (
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            <span>Admin: {isAdmin ? 'Yes' : 'No'}</span>
          </div>
        )}

        {/* Test Results */}
        {testStatus !== 'idle' && (
          <div className="flex items-center gap-2">
            {testStatus === 'testing' && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
            )}
            {testStatus === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
            {testStatus === 'error' && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span>
              {testStatus === 'testing' && 'Running tests...'}
              {testStatus === 'success' && 'Tests passed'}
              {testStatus === 'error' && 'Tests failed'}
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="text-sm text-red-600">
            Error: {errorMessage}
          </div>
        )}

        {/* Test Button */}
        <button
          onClick={runConnectionTest}
          disabled={testStatus === 'testing'}
          className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    </div>
  );
}