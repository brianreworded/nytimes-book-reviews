import Head from 'next/head'
import Link from 'next/link';
var yay = ""  //My primary database :)

async function extract(urling){
  /* Extracting data from NY Times */

  const response = await fetch( //fetch api
    urling, 
    {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
    }
);
    return response.json()
}



async function create_table(df) {
  // creating a table of data extracted from NY Times.
  // This will also be the root to Create and Update data

  var maintable = `<table border = "1" ">
  <tr>
  <th>Title</th>
  <th>Author</th>
  <th>ISBN</th>
  <th>Publication Date</th>
  <th>Summary and New York Times Book Review Link </th>
  <th>User Rating </th>
  <th>User Comments </th>
</tr>
`

  for (let i = 0; i < df.results.length; i++) {

    // creating individual ids as well to call later


    console.log(i+1)
    console.log(df.results.length)
    maintable +=  "<tr>"
    maintable +=  "<th id='title"+ i+"'>" + df.results[i].book_title + "</th>"  
    maintable +=  "<th id='author"+ i+"'>" + df.results[i].book_author + "</th>"
    maintable +=  "<th id='isbn"+ i+"'>" + df.results[i].isbn13[0] + "</th>"
    maintable +=  "<th>" + df.results[i].publication_dt + "</th>"
    maintable +=  "<th> <a href='"+ df.results[i].url + "'> "  + df.results[i].summary + "</a></th>"
    maintable +=  "<th>" + `      <select id="addrating`+i + `">
    <option value="not rated">Not rated yet!</option>
    <option value=0>0 out of 5</option>
    <option value=0.5>0.5 out of 5</option>
    <option value=1>1 out of 5</option>
    <option value=1.5>1.5 out of 5</option>
    <option value=2>2 out of 5</option>
    <option value=2.5>2.5 out of 5</option>
    <option value=3>3 out of 5</option>
    <option value=3.5>3.5 out of 5</option>
    <option value=4>4 out of 5</option>
    <option value=4.5>4.5 out of 5</option>
    <option value=5>5 out of 5</option>
</select>` + "</th>"
    maintable +=  "<th>" + "<textarea rows={3} columns={5} id='comment"+i+"'></textarea></tr>"
   
  }
  maintable += "</table>";
  console.log(maintable)
  return maintable
};





export default function Search() {

  const handleUpdate = async(e) => {
    // Add reviews to database




    var name_a = ""
    var name_b = ""
    var name_c = ""
    var name_d = ""
    for (let i = 0; i < yay.results.length; i++){
      // for each row in database
      name_a = "addrating"+i
      name_b= "comment"+i
      name_c= "author"+i
      name_d= "title"+i

      if (document.getElementById(name_a).value != "not rated" || document.getElementById(name_b).value != ""){
        // if both values (rating and comment) are not null, update or create them in table
        try {
          var author =  yay.results[i].book_author;
          var title =   yay.results[i].book_title ;
          var isbn =   yay.results[i].isbn13[0] ;
          var comments = document.getElementById(name_b).value ;
          var ratings = document.getElementById(name_a).value;
          console.log(author, title, comments, ratings,isbn)
          const body = {author, title, comments, ratings,isbn}
          const response = await fetch("/api/add_item", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
      });
        alert("Information added!")
        }
        catch(error){
          alert("There was an error!")
        }
      }
    }
  }







  const handleSubmit = async(e) => {
    e.preventDefault();
    document.getElementById('buttoning').disabled = true;
    
    try {

      var titles = document.getElementById('title').value;

      var isbns = document.getElementById('isbn').value;

      var authors = document.getElementById('author').value;
      const body = {titles, isbns, authors}

      var url = "https://api.nytimes.com/svc/books/v3/reviews.json?"
    if (isbns.length > 0){
      isbns =  isbns.replace(/\s/g, '%20');
        url = url + "isbn=" + isbns;
    }
    if (titles.length > 0){
      titles =  titles.replace(/\s/g, '%20');
        if (isbns.length > 0){
            url = url + "&title=" +  titles;
        }
        else {
            url = url + "title=" +  titles;
        }
    }
    
    if (authors.length > 0){
        authors =  authors.replace(/\s/g, '%20');
        if (isbns.length > 0 ||  titles.length > 0){
            url = url + "&author=" +  authors;
        }
        else {
            url = url + "author=" +  authors;
        }
    }
    url = url + "&api-key=ci2lIC4qtkYMPAxnpbM8g2s8jfABiUpp"
    console.log(url)
     yay = await extract(url);
    console.log("Result: ", yay.results[0].byline)
    document.getElementById('filler').innerHTML = await create_table(yay);
    document.getElementById('updating').style.display = 'block';
    document.getElementById('buttoning').disabled = false;
  }
  catch(error){
    document.getElementById('buttoning').disabled = false;
    alert("There was an error, try again!");
  }
      
       
  }

  return (
    <div >
      <Head>
        <title>NY Times Book Reviews</title>
        <meta name="description" content="Test for CoSchedule" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main >

        <p>
          Here, you will be searching for book reviews. You can rate or comment on them on their own, if they appear. <br/>
          You only need to enter one field. Entries must be exact, but upper and lower case should not matter. Example for Author field: John Grisham. 
          <br/>
          To submit or update an entry, you need to click the  button on the bottom of the page, which appears when you can view results.
          <br/><br/>
          <p><Link href={'/pastreviews'}>Look at previous reviews, and optionally delete them</Link></p>
        </p>
        
        <input id="isbn" placeholder='ISBN number' />
        <br/><br/>
        <input id="author" placeholder='Author Name (First Name Last Name)'/>
        <br/><br/>
        <input id="title" placeholder='Title'/>
        <br/><br/><br/>
        <button id="buttoning" type="submit" onClick={handleSubmit}>Search</button>
        <br/><br/><br/>
        <div id='filler'></div>
        <br/><br/><br/>
        <button hidden id='updating' onClick={handleUpdate}>Update Results</button>
        <br/><br/><br/>
        <br/><br/><br/>
      </main>
      </div>
  )
}