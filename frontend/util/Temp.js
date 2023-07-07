<DateTime
onChange={(e) => handleDateValue(e, 'start_date')}
name="start_date"
renderInput={(props) => (
  <CustomDatePicker
    value={props.value}
    onClick={props.onClick}
    handleChange={handleDateValue}
  />
)}
inputProps={{
  placeholder: 'Selecciona fecha y hora',
  readOnly: true,
  onClick: () => document.activeElement.blur(),
  name: 'dateTime',
}}
dateFormat="DD-MM-YYYY"
timeFormat="HH:mm"
/>