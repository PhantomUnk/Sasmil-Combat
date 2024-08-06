export const MyButton = (props) => {
   const{
      className = String | undefined,
      theme = Number | 1,
      onClick = undefined
   } = props;
   return (
      <div className={`my-button-${theme} ${className}`} onClick={onClick}>
         {props.children}
      </div>
   )
}
