import fetchData from "../actions"


async function Server() {
    const products = await fetchData();
    console.log(products);

  return (
    <div>
        <h1>Server action - server components</h1>
        {
            products?.map((item, idx) => {
                return (
                    <ul className='p-2 flex flex-col gap-1' key={idx}>
                        <li>{item.id}</li>
                        <li>{item.title}</li>
                        <li>{item.description}</li>
                    </ul>
                )
            })
        }
    </div>
  )
}

export default Server