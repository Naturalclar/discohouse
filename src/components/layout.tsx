import { Header, View } from "@adobe/react-spectrum";
import { ComponentChild, h } from "preact";
import { Link } from "preact-router";

export const Layout = ({
  children,
  user,
}: {
  children: ComponentChild;
  user?: any;
}) => {
  return (
    <View padding={8}>
      <Header
        UNSAFE_style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 924,
          margin: "0 auto",
          padding: "4px 8px",
        }}
      >
        <Link
          style={{
            fontSize: 20,
            textDecoration: "none",
            fontWeight: 700,
            color: "inherit",
          }}
          href="/"
        >
          <span>✌️ </span>Discohouse
        </Link>
        {user ? (
          <Link
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
            href="/mypage"
          >
            Mypage
          </Link>
        ) : (
          <Link
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
            href="/signin"
          >
            Sign-in
          </Link>
        )}
      </Header>
      <View padding={16}>{children}</View>
    </View>
  );
};
