import { Input } from '@chakra-ui/react'
import React from 'react'

const SearchBar = ({ keyword, onChange, align, placeholder }) => {
    const BarStyle = { width: "15rem", background: "#F0F0F0", border: "none", padding: "0.5rem"};
    return (
        <Input
            style={BarStyle}
            key="search-bar"
            value={keyword}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            alignSelf={align}
            mt={"2"}
            right="0px"
        />
    )
}

export default SearchBar