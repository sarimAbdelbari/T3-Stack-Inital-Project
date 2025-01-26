import Container from "@/components/custom-Ui/container";
import NavBar from "@/components/custom-Ui/navbar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (<section>
    <Container>
     <NavBar/>
    {children}
    </Container>
    </section>);
}