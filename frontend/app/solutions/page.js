import { redirect } from 'next/navigation';

// Route renamed to /investigations — permanent redirect to preserve any old links
export default function SolutionsRedirect() {
  redirect('/investigations');
}
