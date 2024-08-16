export const MyInput = (props) => {
   const{
      className = String | undefined,
      theme = Number | 1,
   } = props;
   return (
      <div className={`my-input-${theme} ${className}`}>
         {props.children}
      </div>
   )
}
