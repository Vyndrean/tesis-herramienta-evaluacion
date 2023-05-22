import React, { useEffect as effect, useState } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, HStack, Heading, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { getQuestions } from '@/data/evaluations'

export const getServerSideProps = async (context) => {
  try {
    const check = await checkToken(context.req.headers.cookie)
    if (check.status == 200) {
      return {
        props: {
          id: context.query
        }
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




const questions = ({ id }) => {
  const [questions, setQuestions] = useState([])
  console.log(questions)
  effect(() => {
    getQuestions(id).then(res => {
      setQuestions(res.data)
    })
  }, [])
  return (
    <>
      <Navbar />
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Preguntas</Th>
              <Th>Tipo</Th>
              <Th>Opciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {questions.map((question => (
              <Tr key={question._id}>
                <Td >{question.name}</Td>
                <Td>{question?.type || "No seleccionado"}</Td>
                <Td>
                  <HStack>
                    <Button colorScheme='yellow'> Editar</Button>
                    <Button colorScheme='red'>Eliminar</Button>
                  </HStack>
                </Td>
              </Tr>
            )
            ))
            }

          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}

export default questions