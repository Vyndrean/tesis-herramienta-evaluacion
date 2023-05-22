import React from 'react'
import router from 'next/router'
import {checkToken} from '@/data/login'

export const getServerSideProps = async (context) => {
  try {
    const check = await checkToken(context.req.headers.cookie)
    if (check.status == 200) {
      return {
        props: {}
      }
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }
}

const inicio = () => {
  return (
    <div>inicio</div>
  )
}

export default inicio