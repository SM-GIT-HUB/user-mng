'use server'

async function fetchData()
{
    'use server'

    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();

        return data.products;
    }
    catch(err) {
        console.log(err.message);
        return [];
    }
}

export default fetchData