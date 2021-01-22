import { isAdmin } from '~/utils'
export default function ({ $auth, redirect }) {
  // If the user is not authenticated
  if (!isAdmin($auth)) {
    return redirect('/404')
  }
}