'use client'

import { useEffect, useState } from "react"
import fetchData from "../actions";

function page() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    async function dataFetch()
    {
        setLoading(true);

        const data = await fetchData();
        setProducts(data);

        setLoading(false);
    }

    useEffect(() => {
        dataFetch();
    }, [])

  return (
    <div>
        <h1>server actions - client components</h1>
        {
            !loading? products?.map((item, idx) => {
                return (
                    <ul className='p-2 flex flex-col gap-1' key={idx}>
                        <li>{item.id}</li>
                        <li>{item.title}</li>
                        <li>{item.description}</li>
                        <hr />
                    </ul>
                )
            }) : "Loading..."
        }
    </div>
  )
}

export default page