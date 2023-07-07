import React from 'react'
import { Input } from '@chakra-ui/react'

const CustomDatePicker = ({ value, onClick, handleChange }) => (

  <Input
    value={value}
    onClick={onClick}
    onChange={handleChange}
    borderWidth={1}
    borderRadius="md"
    px={2}
  />
)

export default CustomDatePicker