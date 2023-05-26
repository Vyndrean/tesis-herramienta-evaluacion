import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, HStack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast as Toast, Select, FormLabel, OrderedList, ListItem, Input, Checkbox, Text, Card, CardHeader, Heading, CardBody, Stack, Box } from '@chakra-ui/react'
import { getQuestions, deleteQuestion } from '@/data/evaluations'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'

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
  const [questions, setQuestions] = state([])
  const toast = Toast()
  //console.log(questions)
  const delQuest = (idQuest, idEva) => {
    deleteQuestion(idQuest).then(res => {
      if (res.status == '200') {
        toast({
          title: "Eliminado",
          status: "success",
          isClosable: true,
          duration: 3000
        })
        contentReload(idEva)
      } else {
        toast({
          title: "Ocurrio un error al realizar la peticion, intentelo mas tarde...",
          status: "warning",
          isClosable: true,
          duration: 3000
        })
      }
    })
  }

  const contentReload = async (idEva) => {
    await getQuestions(idEva).then(res => {
      setQuestions(res.data)
    })
  }


  effect(() => {
    getQuestions(id).then(res => {
      setQuestions(res.data)
    })
  }, [])

  return (
    <>
      <Navbar />

      <Container maxW={"container.md"}>
        <Button mt="2" colorScheme='green' onClick={() => router.push(`/preguntas/crear/${id.id}`)}>Añadir preguntas</Button>
        {questions.map((question => (
          <Card key={question._id}>
            <HStack spacing={'auto'}>
              <Stack>
                <CardHeader>
                  <Heading size={"md"}>{question?.questionName}</Heading>
                </CardHeader>
                <CardBody>
                  <Stack>
                    <Box>
                      <form>
                        {question.questionOptions.map((res) => (
                          <div key={res.id}>
                            {question.questionType === 'radio' && (
                              <>
                                <input type="radio" id={res.name} value={res.value} name='answer' />
                                <label htmlFor={res.name}> {res.value}</label>
                              </>
                            )}
                            {question.questionType === 'text' && (
                              <Input value={res?.value} id={res?.name} type="text" />
                            )}
                            {question.questionType === 'checkbox' && (
                              <div>
                                <input type="checkbox" id={res.name} value={res.value} name='answer' />
                                <label htmlFor={res.name}> {res.value} </label>
                              </div>
                            )}
                          </div>
                        ))}
                      </form>
                    </Box>


                  </Stack>
                </CardBody>
              </Stack>
              <Stack paddingRight={"50"}>
                <Button colorScheme='yellow'> <EditIcon /> </Button>
                <Button colorScheme='red' onClick={() => delQuest(question._id, id)}> <DeleteIcon /> </Button>
              </Stack>
            </HStack>
          </Card>
        )))}
      </Container>
    </>
  )
}

export default questions