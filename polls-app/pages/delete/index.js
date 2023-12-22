import React from 'react'
import databaseConnect, { state } from "../../scripts/databaseConnect";
import Poll from "../../model/poll";


//THIS ROUTE WILL DELETE ALL DOCUMENTS IN DATABASE! 
//USE WITH CAUTION


const index = ({data}) => {
    return (
        <div>
            {data}
        </div>
    )
}

export default index

export async function getServerSideProps() {
    if (state !== 1) {
        await databaseConnect();
    }


    await Poll.deleteMany();
    
    
    return {
        props: {
            data: 'dleted all docuemnts :)))'
        }
    }

}
