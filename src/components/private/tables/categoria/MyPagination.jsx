import React from 'react';
import { Link } from 'react-router-dom';

    
    const MyPagination = ({postsPerPage, totalPosts, paginate, active, setActive ,paginaActual,obbb}) => {
  const pageNumbers = [];

  

  for(let i =1; i <= Math.ceil(totalPosts / postsPerPage); i++){
    pageNumbers.push(i);
  }
  
  return (
        <>
            {pageNumbers.map( (number)=>(
            <li key={number} className={`paginate_button page-item`} id= {number} onClick={obbb}>
                <Link onClick={()=> {
                  paginate(number);
                }} aria-controls="productos" className={`page-link`}>{number}</Link>
            </li>
            ))}

        </>
  )
      

  
}

export default MyPagination