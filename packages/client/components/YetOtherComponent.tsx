import React from 'react'
import { Button } from "@mui/material";

const OtherComponent = (props:any) => {
  return <>YB
  <Button variant={props.variant}>{props.text}</Button>
  </>
}

export default OtherComponent;
