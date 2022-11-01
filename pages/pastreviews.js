import prisma from '../lib/prisma';
import { useEffect, useState } from 'react'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import Link from 'next/link';

export async function getServerSideProps({ req, res }) {
    // retrieve data from database
    const datan = await prisma.feedback.findMany({
        select: {
            isbn: true,
            title: true,
            author: true,
            rating: true,
            content: true,

          },
      });
      return {
        props: { 
          ninjas: datan,
         }
      }

    
}
const Ninjas = ({ ninjas }) => {

    let table = '<table border="1">';
    //create format for table to visualize data
    
    table += `<tr><th>ISBN</th><th>Title</th><th>Author</th><th>Rating</th><th>Content</th><th>Delete?</th></tr>`;
    ninjas.forEach((book, index) => {
        table = table + `<tr>`;
        table = table + `<td>${book.isbn}</td>`;
        table = table + `<td>${book.title}</td>`;
        table = table + `<td>${book.author}</td>`;
        table = table + `<td>${book.rating}</td>`;
        table = table + `<td>${book.content}</td>`;
        table = table + `<td><select id="delete`+index + `">
        <option value="No">No, do not delete this</option>
        <option value="Yes">Yes, delete this</option> </td>`;
        table += `</tr>`;
        });
        table += "</table>";

     
    const handleSubmit = async(e) => {
        // actually create table
        e.preventDefault();
        document.getElementById('buttoning2').disabled = true;
        document.getElementById('expand').innerHTML = table;
        document.getElementById('for-delete').style.display = "block";
        document.getElementById('buttoning2').disabled = false;
    }

    const handledelete = async(e) => {
        // delete selected entries

        e.preventDefault();
        document.getElementById('for-delete').disabled = true;
        try {
            var main = ""
            //console.log("OKAY 2")
            for (let i = 0; i < ninjas.length; i++){
                // for each row, if selected to be deleted, delete item from database
                main =  "delete"+i
                console.log("Tested Value: ", document.getElementById(main).value) 
                if (document.getElementById(main).value == 'Yes'){ 
                    console.log("OKAY 3")
                    var isbn = ninjas[i].isbn;
                    const body = {isbn}
                    const response = await fetch("/api/delete_item", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(body),
                });
                alert("Information deleted!")
                
                }
            }
            document.getElementById('for-delete').disabled = false;
            }
                catch(error){
                  alert("There was an error!")
                  document.getElementById('for-delete').disabled = false;
                }
            }
    

    return(
        <div>
            <p>In this section you can see your past reviews, and delete ones you do not care about anymore. These deleted items will only disappear upon refresh.</p>
            <br/><br/><br/>
            <p><Link href={'/'}>Go back to main search engine</Link></p>
            <br/><br/><br/>

        <button onClick={handleSubmit} id="buttoning2">Click here to see your past reviews</button>
        <br/> <br/> <br/> <br/>
        <div id="expand"></div>
        <br/> <br/> <br/> <br/>
        <button hidden id="for-delete" onClick={handledelete}>Delete Selected Items</button>
        </div>
    )
    }
export default Ninjas;
