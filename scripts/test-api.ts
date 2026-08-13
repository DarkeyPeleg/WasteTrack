/**
 * End-to-end API smoke test against a running Next.js server.
 * Usage: npm run dev (other terminal) then npm run test:api
 */
const BASE = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";

type Jar = Map<string, string>;

function storeCookies(jar: Jar, res: Response) {
  const anyHeaders = res.headers as Headers & { getSetCookie?: () => string[] };
  const raw = anyHeaders.getSetCookie?.() ?? [];
  for (const line of raw) {
    const [pair] = line.split(";");
    const idx = pair.indexOf("=");
    if (idx > 0) jar.set(pair.slice(0, idx), pair.slice(idx + 1));
  }
}

function cookieHeader(jar: Jar) {
  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

async function api(
  jar: Jar,
  path: string,
  init: RequestInit = {},
) {
  const headers = new Headers(init.headers);
  if (jar.size) headers.set("cookie", cookieHeader(jar));
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  storeCookies(jar, res);
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { res, data };
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

async function main() {
  const resident = new Map<string, string>();
  const admin = new Map<string, string>();
  const stamp = Date.now();
  const email = `test.resident.${stamp}@example.com`;

  console.log("1) Register resident");
  {
    const { res, data } = await api(resident, "/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Resident",
        email,
        password: "Password123!",
      }),
    });
    assert(res.status === 200, `register expected 200 got ${res.status}: ${JSON.stringify(data)}`);
  }

  console.log("2) Submit collection request");
  let requestId = "";
  {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const { res, data } = await api(resident, "/api/requests", {
      method: "POST",
      body: JSON.stringify({
        address: "15 Independence Ave, Accra",
        wasteType: "General",
        preferredDate: tomorrow.toISOString().slice(0, 10),
        description: "Two bags by the compound gate",
      }),
    });
    assert(res.status === 201, `create expected 201 got ${res.status}: ${JSON.stringify(data)}`);
    requestId = (data as { request: { id: string } }).request.id;
  }

  console.log("3) Validation rejects past date");
  {
    const { res } = await api(resident, "/api/requests", {
      method: "POST",
      body: JSON.stringify({
        address: "15 Independence Ave, Accra",
        wasteType: "General",
        preferredDate: "2020-01-01",
        description: "Should fail",
      }),
    });
    assert(res.status === 400, `past date expected 400 got ${res.status}`);
  }

  console.log("4) Resident cannot access admin APIs");
  {
    const { res } = await api(resident, "/api/admin/requests");
    assert(res.status === 403, `resident admin list expected 403 got ${res.status}`);
  }

  console.log("5) Admin login");
  {
    const { res, data } = await api(admin, "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "admin@wastetrack.gh",
        password: "Password123!",
      }),
    });
    assert(res.status === 200, `admin login expected 200 got ${res.status}: ${JSON.stringify(data)}`);
  }

  console.log("6) Assign collector from system list");
  let collectorId = "";
  {
    const { res, data } = await api(admin, "/api/admin/collectors");
    assert(res.status === 200, `collectors expected 200 got ${res.status}`);
    const collectors = (data as { collectors: Array<{ id: string }> }).collectors;
    assert(collectors.length > 0, "expected seeded collectors");
    collectorId = collectors[0].id;
  }
  {
    const { res, data } = await api(admin, `/api/admin/requests/${requestId}`, {
      method: "PATCH",
      body: JSON.stringify({ collectorId }),
    });
    assert(res.status === 200, `assign expected 200 got ${res.status}: ${JSON.stringify(data)}`);
    assert(
      (data as { request: { status: string } }).request.status === "ASSIGNED",
      "status should be ASSIGNED",
    );
  }

  console.log("7) Progress to IN_PROGRESS then COLLECTED");
  {
    let { res, data } = await api(admin, `/api/admin/requests/${requestId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "IN_PROGRESS" }),
    });
    assert(res.status === 200, `in progress expected 200 got ${res.status}`);
    ({ res, data } = await api(admin, `/api/admin/requests/${requestId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "COLLECTED" }),
    }));
    assert(res.status === 200, `collected expected 200 got ${res.status}`);
    assert(
      (data as { request: { status: string } }).request.status === "COLLECTED",
      "status should be COLLECTED",
    );
  }

  console.log("8) Resident can see assigned collector");
  {
    const { res, data } = await api(resident, "/api/requests");
    assert(res.status === 200, `resident list expected 200 got ${res.status}`);
    const found = (data as { requests: Array<{ id: string; collector: { name: string } | null }> }).requests.find(
      (item) => item.id === requestId,
    );
    assert(found?.collector?.name, "resident should see collector details");
  }

  console.log("9) Update profile");
  {
    const { res, data } = await api(resident, "/api/profile", {
      method: "PATCH",
      body: JSON.stringify({
        name: "Updated Resident",
        email,
      }),
    });
    assert(res.status === 200, `profile update expected 200 got ${res.status}: ${JSON.stringify(data)}`);
    assert(
      (data as { user: { name: string } }).user.name === "Updated Resident",
      "name should update",
    );
  }

  console.log("10) Stats endpoint");
  {
    const { res, data } = await api(admin, "/api/admin/stats");
    assert(res.status === 200, `stats expected 200 got ${res.status}`);
    assert(
      (data as { counts: { total: number } }).counts.total >= 1,
      "stats total should be >= 1",
    );
  }

  console.log("\nAll API tests passed.");
}

main().catch((err) => {
  console.error("\nAPI tests failed:", err.message);
  process.exit(1);
});
