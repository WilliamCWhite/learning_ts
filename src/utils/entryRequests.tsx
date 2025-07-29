import type { DBEntry, FetchParams } from "./interfaces";

const API_URL = "http://localhost:7070/api";

export async function entryGet(
  params: FetchParams,
  listID: number,
): Promise<DBEntry[]> {
  try {
    const response = await fetch(`${API_URL}/entries/${listID}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${params.jwtToken}` },
    });
    params.handleJwtFailure(response.status, params.navigate);
    const data = (await response.json()) as DBEntry[];
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function entryPost(
  params: FetchParams,
  listID: number,
  entry: Partial<DBEntry>,
): Promise<DBEntry> {
  try {
    const response = await fetch(`${API_URL}/entries/${listID}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${params.jwtToken}` },
      body: JSON.stringify({
        name: entry.name,
        score: entry.score,
      }),
    });
    params.handleJwtFailure(response.status, params.navigate);
    const data = (await response.json()) as DBEntry;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function entryPut(
  params: FetchParams,
  listID: number,
  entry: Partial<DBEntry>,
) {
  try {
    const response = await fetch(`${API_URL}/entries/${listID}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${params.jwtToken}` },
      body: JSON.stringify({
        name: entry.name,
        score: entry.score,
        entry_id: entry.entry_id
      }),
    });
    params.handleJwtFailure(response.status, params.navigate);
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function entryDelete(
  params: FetchParams,
  listID: number,
  entryID: number
) {
  try {
    const response = await fetch(`${API_URL}/entries/${listID}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${params.jwtToken}` },
      body: JSON.stringify({
        entry_id: entryID
      }),
    });
    params.handleJwtFailure(response.status, params.navigate);
  } catch (error) {
    console.error(error);
    throw error
  }
}



