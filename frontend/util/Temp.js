<form onSubmit={handleSubmit} id='form'>
<ModalBody>
  <FormControl>
    <FormLabel>Producto</FormLabel>
    <Select name='product' placeholder='Seleccione...' onChange={handleChange} isRequired>
      {
        product.map((res) => (
          <option value={res._id} key={res._id}>{res.name}</option>
        ))
      }
    </Select>
  </FormControl>
  
  <Stack>
    <HStack>
      <FormControl maxW="40%">
        <FormLabel>Fecha de inicio</FormLabel>
        <Input name='start_date' type='date' placeholder='Fecha de inicio de la evaluación' onChange={handleEvaluationChange} required min={currentDate} />
      </FormControl>
      <FormControl maxW="20%">
        <FormLabel>Hora de inicio</FormLabel>
        <Input textAlign="center" name='start_time' type='time' placeholder='Hora de inicio de la evaluación' onChange={handleEvaluationChange} required defaultValue="00:00" />
      </FormControl>
    </HStack>
  </Stack>
  {
    renderEndDate()
  }
  <FormControl>
    <FormLabel>Destinatario/os</FormLabel>
    <Textarea name='destinatary' type='email' onChange={handleChangeEmail} isRequired ></Textarea>
    <FormHelperText textAlign="center">Para ingresar múltiples correos estos deben ser separados por una coma</FormHelperText>
  </FormControl>
</ModalBody>

<HStack justifyContent="space-between" marginBlock="5" marginInline="10">
  <CustomButton borderRadius="17" h="9" colorScheme='green' type='submit'>Enviar</CustomButton>
  <CustomButton borderRadius="17" h="9" colorScheme='red' mr={3} onClick={onClose}>
    Cancelar
  </CustomButton>
</HStack>

</form>