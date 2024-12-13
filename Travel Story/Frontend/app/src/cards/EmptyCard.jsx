import React from 'react'

const EmptyCard = ({imgSrc,message}) => {
  return (
    <div className='mx-auto flex flex-col items-center justify-center mt-20'>
        <img src={imgSrc} alt="No Notes"  className='w-24 '/>
        <p className='w-1/2 text-sm font-medium text-blue-400  text-center leading-7 mt-5'>
            {message}
        </p>
    </div>
  )
}

export default EmptyCard