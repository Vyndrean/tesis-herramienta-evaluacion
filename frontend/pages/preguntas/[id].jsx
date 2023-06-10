import React, { useEffect as effect, useState as state } from 'react'
import router from 'next/router'
import { checkToken } from '@/data/login'
import Navbar from '@/components/Navbar'
import { Button, Container, HStack, useToast as Toast, Input, Card, CardHeader, Heading, CardBody, Stack, Box, Text } from '@chakra-ui/react'
import { getQuestions } from '@/data/evaluations'
import { EditIcon } from '@chakra-ui/icons'
import CreateQuestion from '@/components/CreateQuestion'
import DeleteOption from '@/components/DeleteOption'

export const getServerSideProps = async (context) => {
  try {
    const check = await checkToken(context.req.headers.cookie)
    if (check.status == 200) {
      return {
        props: {
          id: context.query.id
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

  const contentReload = async () => {
    await getQuestions(id).then(res => {
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
        <CreateQuestion id={id} />
        {questions.map((question => (
          <Card key={question._id} bg='blackAlpha.50' mb="5">
            <HStack spacing={'auto'}>
              <Stack>
                <CardHeader>
                  <Heading size={"md"}>{question?.questionName}</Heading>
                  <Text>{question?.questionContext}</Text>
                </CardHeader>
                <CardBody>
                  <Stack>
                    <Box>
                      <form>
                        {question.questionOptions.map((res) => (
                          <div key={res.name + res.value}>
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
              <Stack paddingRight={"25"}>
                <Button colorScheme='yellow'> <EditIcon /> </Button>
                <DeleteOption refe='question' id={question._id} reload={contentReload}/>
              </Stack>
            </HStack>
          </Card>
        )))}

        <hr/>

        
      </Container>
    </>
  )
}

export default questions