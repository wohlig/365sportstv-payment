export default function ({ redirect}) {
  if (localStorage.accessToken === undefined) {
    return redirect('/')
  }
}
