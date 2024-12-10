export type FirebaseErrorCode = 
  | 'unavailable'
  | 'failed-precondition'
  | 'permission-denied'
  | 'not-found'
  | 'already-exists'
  | 'resource-exhausted'
  | 'cancelled'
  | 'data-loss'
  | 'unauthenticated'
  | 'unknown';

interface FirebaseError {
  code: FirebaseErrorCode;
  message: string;
}

export const handleFirebaseError = (error: any): FirebaseError => {
  console.error('Firebase operation failed:', error);
  
  const code = error.code as FirebaseErrorCode;
  let message: string;
  
  switch (code) {
    case 'unavailable':
      message = 'Network connection lost. The app will continue working offline and sync when connection is restored.';
      break;
    case 'failed-precondition':
      message = 'Operation failed. Please refresh the page and try again.';
      break;
    case 'permission-denied':
      message = 'You do not have permission to perform this action.';
      break;
    case 'not-found':
      message = 'The requested resource was not found.';
      break;
    case 'already-exists':
      message = 'This record already exists.';
      break;
    case 'resource-exhausted':
      message = 'Too many requests. Please try again later.';
      break;
    case 'cancelled':
      message = 'Operation was cancelled. Please try again.';
      break;
    case 'data-loss':
      message = 'Critical error: Data loss occurred. Please contact support.';
      break;
    case 'unauthenticated':
      message = 'Please sign in to continue.';
      break;
    default:
      message = 'An unexpected error occurred. Please try again.';
      code = 'unknown';
  }

  return { code, message };
};