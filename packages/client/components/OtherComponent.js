import React from 'react'
import { Button } from "@mui/material";

const OtherComponent = (props) => {
  return <>b<Button variant={props.variant}>c{props.text}</Button></>
}

export default OtherComponent;