import { error } from '@sveltejs/kit'

export async function load({ fetch, params }) {
    let res = await fetch(`http://localhost:3000/api/players?player_id=${params.id}`, { method: 'GET' });
    const data = res.json();

    if (res.ok) {
        return { player: data };
    } else {
        error(404, 'No player found.')
    }
}