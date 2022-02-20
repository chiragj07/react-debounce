import React, { useCallback, useEffect, useState } from 'react'
// import useDebounce from '../hooks/useDebounce';
const Home = () => {

    const [dbs, setDbs] = useState("");
    const [books ,setBooks]= useState([]);
    const [page, setPage] = useState(1)
    const debounce = (func, delay)=>{
        let timer;
        return function(...args){
            if(timer) clearTimeout(timer);
            const self= this;
            timer = setTimeout(()=> func.apply(self,args), delay);
        }
    }
    useEffect(()=>{
        setBooks([])
    },[dbs]);

    useEffect(() => {
        fetch(`http://openlibrary.org/search.json?q=${dbs}&page=${page}`).then(res=> res.json()).then(data=> setBooks(pre=>[...new Set([...pre, ...data.docs.map(book=>book.title)])])).catch(err=> console.log(err))
      
    }, [dbs,page])
    


    const db = debounce((e)=>setDbs(e.target.value),1000);
    
     return (
    <>
     <input type="text"  onChange= {db} />
     <div>
         {
            books.length >0 && books.map((book)=><h2 key={book}>{book}</h2>)
         }
     </div>

    </>
  )
}

export default Home