// Type definitions for NavigationReact 2.0.3
// Project: http://grahammendick.github.io/navigation/
// Definitions by: Graham Mendick <https://github.com/grahammendick>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

///<reference path="navigation.d.ts"/>
///<reference path="react.d.ts"/>

declare module 'navigation-react' {
    export = NavigationReact;
}

declare namespace NavigationReact {
    import React = __React;

    /**
     * Defines the Link Props contract
     */
    interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
        /**
         * Indicates Links should not listen for navigate events
         */
        lazy?: boolean;
        /**
         * Determines the effect on browser history
         */
        historyAction?: 'add' | 'replace' | 'none';
        /**
         * Handles Link click events
         */
        navigating?: (e: MouseEvent, domId: string, link: string) => boolean;
        /**
         * The State Navigator
         */
        stateNavigator?: Navigation.StateNavigator;
    }

    /**
     * Defines the Refresh Link Props contract
     */
    interface RefreshLinkProps extends LinkProps {
        /**
         * The NavigationData to pass
         */
        navigationData?: any;
        /**
         * Indicates to include all the current NavigationData
         */
        includeCurrentData?: boolean;
        /**
         * The data to add from the current NavigationData
         */
        currentDataKeys?: string;
        /**
         * The Css Class to display when the Link is active
         */
        activeCssClass?: string;
        /**
         * Indicates whether the Link is disabled when active
         */
        disableActive?: boolean;
    }

    /**
     * Hyperlink Component the navigates to the current State
     */
    class RefreshLink extends React.Component<RefreshLinkProps, any> { }

    /**
     * Defines the Navigation Link Props contract
     */
    interface NavigationLinkProps extends RefreshLinkProps {
        /**
         * The key of the State to navigate to
         */
        stateKey: string;
    }

    /**
     * Hyperlink Component the navigates to a State
     */
    class NavigationLink extends React.Component<NavigationLinkProps, any> { }

    /**
     * Defines the Navigation Back Link Props contract
     */
    interface NavigationBackLinkProps extends RefreshLinkProps {
        /**
         * Starting at 1, The number of Crumb steps to go back
         */
        distance: number;
    }

    /**
     * Hyperlink Component the navigates back along the crumb trail
     */
    class NavigationBackLink extends React.Component<NavigationBackLinkProps, any> { }
}
