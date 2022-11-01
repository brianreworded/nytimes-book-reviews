import prisma from "../../lib/prisma";
export default async function handler(req, res) {
    if (req.method === 'POST') {
        return await deleteInquiry(req, res);
    } 
    else {
        return res.status(405).json({ message: 'Method not allowed', success: false });
    }
}


async function deleteInquiry(req, res){
    const body = req.body;
    try {

        const deleteItem = await prisma.feedback.delete({
            where: {
                isbn: body.isbn,
            },
            })
        
        return res.status(200).json("Deleted!", {success: true});
    }
    catch(error){
        console.error("Request error", error);
        res.status(500).json({ error: "Error creating result", success:false });
    }
    
}

