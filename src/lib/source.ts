import { incrementOrCreateVisit, markInactive } from './profile';

function getSourceUrl(username: string, branch: string) {
  return `https://raw.githubusercontent.com/${username}/.opn/refs/heads/${branch}/bio.json`;
}

async function fetchSource(username: string, branch: string) {
  const url = getSourceUrl(username, branch);
  const res = await fetch(url);

  return { status: res.status, url };
}

export async function getSource(username: string) {
  const main = await fetchSource(username, 'main');

  if (main.status === 200 || main.status === 429) {
    await incrementOrCreateVisit(username);

    return main.url;
  }

  const master = await fetchSource(username, 'master');

  if (master.status === 200) {
    await incrementOrCreateVisit(username);

    return master.url;
  }

  if (main.status === 404 && master.status === 404) {
    await markInactive(username);

    return null;
  }

  return main.url;
}
