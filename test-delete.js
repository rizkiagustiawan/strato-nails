async function run() {
  console.log("Checking Vercel server...");
  try {
    const res = await fetch('http://localhost:3000/api/bookings/SN-TEST', { method: 'DELETE' });
    console.log(res.status, await res.text());
  } catch (e) {
    console.log("Vercel dev server not running.");
  }
}
run();
