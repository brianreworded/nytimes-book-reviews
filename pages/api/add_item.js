import prisma from "../../lib/prisma";
export default async function handler(req, res) {
    if (req.method === 'POST') {
        return await createInquiry(req, res);
    } 
    else {
        return res.status(405).json({ message: 'Method not allowed', success: false });
    }
}


async function createInquiry(req, res){
    const body = req.body
    try {


        /* Bug testing
        console.log("OKAY 2")
        console.log("OKAY 2: ", body.author)
        console.log("OKAY 3: ", body.comments)
        console.log("OKAY 4: ", body.ratings)
        console.log("OKAY 5: ", body.title)
        */
        

        const updateItem = await prisma.feedback.upsert({
            where: {
                isbn: body.isbn,
            },
            update: {
                isbn: body.isbn,
                author: body.author,
                title: body.title,
                content: body.comments,
                rating: body.ratings,
            },
            create: {
                isbn: body.isbn,
                author: body.author,
                title: body.title,
                content: body.comments,
                rating: body.ratings,
            },
            })
        
        return res.status(200).json("Added", {success: true});
    }
    catch(error){
        console.error("Request error", error);
        res.status(500).json({ error: "Error creating result", success:false });
    }
    
}

