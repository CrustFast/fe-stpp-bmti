
const API_URL = "http://localhost:8080";

async function test(params) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_URL}/api/v1/dumas?${query}`;
    console.log(`\nFetching: ${url}`);
    try {
        const res = await fetch(url);
        console.log(`Status: ${res.status} ${res.statusText}`);
        if (!res.ok) {
            const text = await res.text();
            console.log(`Error Body: ${text}`);
            return;
        }
        const json = await res.json();
        const reports = json.data?.data || [];
        console.log(`Success. Reports count: ${reports.length}`);
        if (reports.length > 0) {
            console.log("Sample report:", JSON.stringify(reports[0], null, 2));
        }
    } catch (e) {
        console.log(`Exception: ${e.message}`);
    }
}

async function run() {
    console.log("--- Test 1: Basic Fetch ---");
    await test({ page: "1", limit: "10" });

    console.log("--- Test 2: Filter Year 2025 ---");
    await test({ year: "2025", page: "1", limit: "10" });

    console.log("--- Test 3: Filter Category Pengaduan ---");
    await test({ category: "pengaduan", page: "1", limit: "10" });
}

run();
