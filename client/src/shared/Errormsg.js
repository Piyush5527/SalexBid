import React from 'react'

const errormsg = (props) => {
  return (
    <div style={{textAlign:'center',color:props.colors}}>{props.message}</div>
  )
}

export default errormsg