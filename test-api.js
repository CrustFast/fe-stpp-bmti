
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
    console.log("--- Test 1: Fetch Program Keahlian ---");
    const url1 = `${API_URL}/api/ref/program-keahlian`;
    console.log(`Fetching: ${url1}`);
    try {
        const res = await fetch(url1);
        console.log(`Status: ${res.status} ${res.statusText}`);
        if (!res.ok) {
            const text = await res.text();
            console.log(`Error Body: ${text.substring(0, 200)}...`);
        } else {
            const json = await res.json();
            console.log("Success. Data:", JSON.stringify(json, null, 2).substring(0, 200) + "...");
        }
    } catch (e) {
        console.log(`Exception: ${e.message}`);
    }

    console.log("\n--- Test 2: Fetch Jenis Benturan ---");
    const url2 = `${API_URL}/api/ref/jenis-benturan`;
    console.log(`Fetching: ${url2}`);
    try {
        const res = await fetch(url2);
        console.log(`Status: ${res.status} ${res.statusText}`);
        if (!res.ok) {
            const text = await res.text();
            console.log(`Error Body: ${text.substring(0, 200)}...`);
        } else {
            const json = await res.json();
            console.log("Success. Data:", JSON.stringify(json, null, 2).substring(0, 200) + "...");
        }
    } catch (e) {
        console.log(`Exception: ${e.message}`);
    }
}

run();
