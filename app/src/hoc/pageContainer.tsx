const pageContainer = (WrapComponent: any) => {

  const PageContainerHoc = (props: any) => <WrapComponent {...props} />

  return PageContainerHoc;
}


export default pageContainer;

