export const URL_API = "https://symmetrical-space-trout-r597v6rrrxv356w5-80.app.github.dev/api";

export async function METHOD_GET(resource) {
    try {
        let response = await fetch(URL_API + resource);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error(error);
    }
};

export async function METHOD_POST(resource, data) {
    try {
        let response = await fetch(URL_API + resource, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error(error);
    }
}