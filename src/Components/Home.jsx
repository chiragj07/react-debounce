import React, { useCallback, useEffect, useState ,useRef } from 'react'
// import useDebounce from '../hooks/useDebounce';
const Home = () => {

    const [dbs, setDbs] = useState("");
    const [books ,setBooks]= useState([]);
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
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
        setLoading(true)
        fetch(`http://openlibrary.org/search.json?q=${dbs}&page=${page}`).then(res=> res.json()).then(data=> {  
             console.log(data);
             setHasMore(data.docs.length > 0);
            setBooks(pre=>[...new Set([...pre, ...data.docs.map(book=>book.title)])])
            console.log(books.length)
            setLoading(false);
        }).catch(
                err=> {
                    setLoading(false);
                    console.log(err)
                    return <><div>ERROR</div></>
                   
                })
      
    }, [dbs,page])
    
    const observer = useRef();
    const lastElement = useCallback((node)=>{
            if(loading) return ;
            if(observer.current) observer.current.disconnect();
            
            observer.current = new IntersectionObserver((entries)=>{
                    if(entries[0].isIntersecting && hasMore) setPage(page => page+1);
            });
            if(node) observer.current.observe(node);



    },[loading, hasMore]);
    const db = debounce((e)=>setDbs(e.target.value),1000);
    
     return (
    <>
     <input type="text"  onChange= {db} />
     <div>
         {
            books.length > 0 && books.map((book, index)=>{return (
            index+1=== books.length ? <h2 key={book} ref = {lastElement}>{book}</h2> :
            <h2 key={book}>{book}</h2>)}) 
          }
    <div> {loading && "Loading" }</div> 
     </div>

    </>
  )
}

export default Home