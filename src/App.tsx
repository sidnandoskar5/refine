import {
    AuthProvider,
    Authenticated,
    Refine,
} from "@refinedev/core";
import { DevtoolsPanel } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
    ThemedLayoutV2,
    ErrorComponent,
    useNotificationProvider,
    RefineThemes,
    ThemedSiderV2,
    ThemedTitleV2,
} from "@refinedev/mantine";
import { NotificationsProvider } from "@mantine/notifications";
import {
    MantineProvider,
    Global,
    useMantineColorScheme,
    Header as MantineHeader,
    Group,
    ActionIcon,
    ColorScheme,
    ColorSchemeProvider,
    List,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import routerBindings, {
    CatchAllNavigate,
    DocumentTitleHandler,
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import axios from "axios";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { CredentialResponse } from "./interfaces/google";
import {
    BlogPostCreate,
    BlogPostEdit,
    BlogPostList,
    BlogPostShow,
} from "./pages/blog-posts";
import {
    CategoryCreate,
    CategoryEdit,
    CategoryList,
    CategoryShow,
} from "./pages/categories";
import { Login } from "./pages/login";
import { parseJwt } from "./utils/parse-jwt";

import {
    IconSun,
    IconMoonStars,
    IconBrandZulip,
    IconCategory,
    IconAlarmPlus,
} from "@tabler/icons-react";
import { Zust } from "./pages/zustands";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
});

const Header = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    return (
        <MantineHeader height={65} p="xs">
            {/* <Group position="left">
                <List>
                    <List.Item>Vite</List.Item>
                    <List.Item>tanstack</List.Item>
                    <List.Item>tanstack</List.Item>
                </List>
            </Group> */}
            <Group position="right">
                <ActionIcon
                    variant="outline"
                    color={dark ? "yellow" : "primary"}
                    onClick={() => toggleColorScheme()}
                    title="Toggle color scheme"
                >
                    {dark ? <IconSun /> : <IconMoonStars />}
                </ActionIcon>
            </Group>
        </MantineHeader>
    );
};

function App() {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: "mantine-color-scheme",
        defaultValue: "light",
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

    const authProvider: AuthProvider = {
        login: async ({ credential }: CredentialResponse) => {
            const profileObj = credential ? parseJwt(credential) : null;

            if (profileObj) {
                if (
                    !profileObj.email.toLowerCase().includes("media.net")
                ) {
                    return {
                        success: false,
                    };
                }
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...profileObj,
                        avatar: profileObj.picture,
                    })
                );

                localStorage.setItem("token", `${credential}`);

                return {
                    success: true,
                    redirectTo: "/",
                };
            }

            return {
                success: false,
            };
        },
        logout: async () => {
            const token = localStorage.getItem("token");

            if (token && typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                axios.defaults.headers.common = {};
                window.google?.accounts.id.revoke(token, () => {
                    return {};
                });
            }

            return {
                success: true,
                redirectTo: "/login",
            };
        },
        onError: async (error) => {
            console.error(error);
            return { error };
        },
        check: async () => {
            const token = localStorage.getItem("token");

            if (token) {
                return {
                    authenticated: true,
                };
            }

            return {
                authenticated: false,
                error: {
                    message: "Check failed",
                    name: "Token not found",
                },
                logout: true,
                redirectTo: "/login",
            };
        },
        getPermissions: async () => null,
        getIdentity: async () => {
            const user = localStorage.getItem("user");
            if (user) {
                return JSON.parse(user);
            }

            return null;
        },
    };

    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <MantineProvider
                theme={{
                    ...RefineThemes.Blue,
                    colorScheme: colorScheme,
                }}
                withNormalizeCSS
                withGlobalStyles
            >
                <Global styles={{ body: { WebkitFontSmoothing: "auto" } }} />
                <NotificationsProvider position="top-right">
                    <BrowserRouter>
                        <RefineKbarProvider>
                            <Refine
                                dataProvider={dataProvider(
                                    "https://api.fake-rest.refine.dev"
                                )}
                                authProvider={authProvider}
                                routerProvider={routerBindings}
                                notificationProvider={useNotificationProvider}
                                resources={[
                                    {
                                        name: "blog_posts",
                                        list: "/blog-posts",
                                        create: "/blog-posts/create",
                                        edit: "/blog-posts/edit/:id",
                                        show: "/blog-posts/show/:id",
                                        meta: {
                                            canDelete: true,
                                        },
                                        icon: <IconCategory />,
                                    },
                                    // {
                                    //     name: "categories",
                                    //     list: "/categories",
                                    //     create: "/categories/create",
                                    //     edit: "/categories/edit/:id",
                                    //     show: "/categories/show/:id",
                                    //     meta: {
                                    //         canDelete: true,
                                    //     },
                                    // },
                                    {
                                        name: "Zustand Demo",
                                        list: "/zustands",
                                        icon: <IconBrandZulip />,
                                    },
                                ]}
                                options={{
                                    syncWithLocation: true,
                                    warnWhenUnsavedChanges: true,
                                    useNewQueryKeys: true,
                                    projectId: "niymWQ-BqQ2NQ-wXh1WR",
                                }}
                            >
                                <Routes>
                                    <Route
                                        element={
                                            <Authenticated
                                                key="authenticated-inner"
                                                fallback={
                                                    <CatchAllNavigate to="/login" />
                                                }
                                            >
                                                <ThemedLayoutV2
                                                    // Title={({ collapsed }) => (
                                                    //     <ThemedTitleV2
                                                    //         collapsed={
                                                    //             collapsed
                                                    //         }
                                                    //         icon={ <IconAlarmPlus /> }
                                                    //         text="Siddhesh"
                                                    //     />
                                                    // )}

                                                    // Header={Header}
                                                >
                                                    <Outlet />
                                                </ThemedLayoutV2>
                                            </Authenticated>
                                        }
                                    >
                                        <Route
                                            index
                                            element={
                                                <NavigateToResource resource="blog_posts" />
                                            }
                                        />
                                        <Route path="/blog-posts">
                                            <Route
                                                index
                                                element={<BlogPostList />}
                                            />
                                            <Route
                                                path="create"
                                                element={<BlogPostCreate />}
                                            />
                                            <Route
                                                path="edit/:id"
                                                element={<BlogPostEdit />}
                                            />
                                            <Route
                                                path="show/:id"
                                                element={<BlogPostShow />}
                                            />
                                        </Route>
                                        <Route path="/categories">
                                            <Route
                                                index
                                                element={<CategoryList />}
                                            />
                                            <Route
                                                path="create"
                                                element={<CategoryCreate />}
                                            />
                                            <Route
                                                path="edit/:id"
                                                element={<CategoryEdit />}
                                            />
                                            <Route
                                                path="show/:id"
                                                element={<CategoryShow />}
                                            />
                                        </Route>
                                        <Route path="/zustands">
                                            <Route index element={<Zust />} />
                                        </Route>
                                        <Route
                                            path="*"
                                            element={<ErrorComponent />}
                                        />
                                    </Route>
                                    <Route
                                        element={
                                            <Authenticated
                                                key="authenticated-outer"
                                                fallback={<Outlet />}
                                            >
                                                <NavigateToResource />
                                            </Authenticated>
                                        }
                                    >
                                        <Route
                                            path="/login"
                                            element={<Login />}
                                        />
                                    </Route>
                                </Routes>
                                <RefineKbar />
                                <UnsavedChangesNotifier />
                                <DocumentTitleHandler />
                            </Refine>
                            <DevtoolsPanel />
                        </RefineKbarProvider>
                    </BrowserRouter>
                </NotificationsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}

export default App;
