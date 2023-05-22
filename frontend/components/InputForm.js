import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'

const InputForm = ({ label, handleChange, name, placeholder, type, value, maxLength, minLength }) => {
    return (
        <FormControl id={name} isRequired>
            <FormLabel>{label}</FormLabel>
            <Input type={type} placeholder={placeholder} name={name} onChange={handleChange} value={value} maxLength={maxLength} minLength={minLength} />
        </FormControl>
    )
}

export default InputForm