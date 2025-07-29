import type { DBList, FetchParams } from "./interfaces";

const API_URL = "http://localhost:7070/api";

export async function listGet(params: FetchParams): Promise<DBList[]> {
  try {
    const response = await fetch(`${API_URL}/lists`, {
      method: "GET",
      headers: { Authorization: `Bearer ${params.jwtToken}` },
    });
    params.handleJwtFailure(response.status, params.navigate);
    const data = (await response.json()) as DBList[];
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function listPost(
  params: FetchParams,
  list: Partial<DBList>,
): Promise<DBList> {
  try {
    const response = await fetch(`${API_URL}/lists`, {
      method: "POST",
      headers: { Authorization: `Bearer ${params.jwtToken}` },
      body: JSON.stringify({
        title: list.title,
      }),
    });
    params.handleJwtFailure(response.status, params.navigate);
    const data = (await response.json()) as DBList;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function listPut(
  params: FetchParams,
  list: Partial<DBList>,
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/lists`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${params.jwtToken}` },
      body: JSON.stringify({
        title: list.title,
        list_id: list.list_id,
      }),
    });
    params.handleJwtFailure(response.status, params.navigate);
  } catch (error) {
    console.error(error);
    throw error
  }
}

export async function listDelete(
  params: FetchParams,
  listID: number,
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/lists`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${params.jwtToken}` },
      body: JSON.stringify({
        list_id: listID,
      }),
    });
    params.handleJwtFailure(response.status, params.navigate);
  } catch (error) {
    console.error(error);
    throw error
  }
}
