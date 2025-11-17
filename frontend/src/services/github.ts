import type { GitHubFileResponse, GitHubCommitResponse } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = import.meta.env.VITE_GITHUB_REPO_OWNER || 'cinnamon-msft';
const REPO_NAME = import.meta.env.VITE_GITHUB_REPO_NAME || 'tangled';
const BRANCH = import.meta.env.VITE_GITHUB_BRANCH || 'main';

// Error handler for 401 responses - will be set by AuthContext
let authErrorHandler: (() => void) | null = null;

export const setAuthErrorHandler = (handler: () => void) => {
  authErrorHandler = handler;
};

/**
 * Get file content from GitHub repository
 */
export async function getFileContent(
  path: string,
  token: string
): Promise<GitHubFileResponse> {
  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (response.status === 401) {
    authErrorHandler?.();
    throw new Error('Authentication failed. Please sign in again.');
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get the SHA of a file (needed for updates)
 */
export async function getFileSHA(path: string, token: string): Promise<string> {
  const file = await getFileContent(path, token);
  return file.sha;
}

/**
 * Commit a file to the repository (last-write-wins strategy)
 * Always fetches the latest SHA before committing to ensure we're updating the latest version
 */
export async function commitFile(
  path: string,
  content: string,
  message: string,
  token: string
): Promise<GitHubCommitResponse> {
  // Fetch latest SHA to ensure last-write-wins
  let sha: string | undefined;
  try {
    sha = await getFileSHA(path, token);
  } catch (error) {
    // File might not exist yet (first commit)
    console.log(`File ${path} doesn't exist yet, will create it`);
  }

  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  
  // Encode content to base64
  const encodedContent = btoa(unescape(encodeURIComponent(content)));

  const body: {
    message: string;
    content: string;
    branch: string;
    sha?: string;
  } = {
    message,
    content: encodedContent,
    branch: BRANCH,
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    authErrorHandler?.();
    throw new Error('Authentication failed. Please sign in again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to commit file: ${response.statusText}. ${errorData.message || ''}`
    );
  }

  return response.json();
}

/**
 * Decode base64 content from GitHub API response
 */
export function decodeContent(encodedContent: string): string {
  return decodeURIComponent(escape(atob(encodedContent)));
}

/**
 * Helper to commit JSON data to a file
 */
export async function commitJSONFile<T>(
  path: string,
  data: T,
  message: string,
  token: string
): Promise<GitHubCommitResponse> {
  const content = JSON.stringify(data, null, 2);
  return commitFile(path, content, message, token);
}
