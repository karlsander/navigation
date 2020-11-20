package com.navigation.reactnative;

import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.text.SpannableString;
import android.text.style.AbsoluteSizeSpan;
import android.text.style.StyleSpan;
import android.text.style.TypefaceSpan;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageButton;

import androidx.annotation.Nullable;
import androidx.appcompat.view.menu.ActionMenuItemView;
import androidx.appcompat.widget.ActionMenuView;
import androidx.appcompat.widget.AppCompatImageButton;
import androidx.appcompat.widget.AppCompatImageView;
import androidx.appcompat.widget.Toolbar;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.text.ReactTypefaceUtils;
import com.google.android.material.appbar.AppBarLayout;

import java.util.ArrayList;

public class ToolbarView extends Toolbar {
    private MenuItem searchMenuItem;
    private String title;
    private String titleFontFamily;
    private String titleFontWeight;
    private String titleFontStyle;
    private Integer titleFontSize;
    private boolean titleChanged = false;
    private Integer tintColor;
    private ImageButton collapseButton;
    private OnSearchListener onSearchAddedListener;
    int defaultTitleTextColor;
    Drawable defaultOverflowIcon;
    private Integer defaultMenuTintColor;
    private String navigationTestID;
    private String overflowTestID;
    private IconResolver.IconResolverListener logoResolverListener;
    private IconResolver.IconResolverListener navIconResolverListener;
    private IconResolver.IconResolverListener overflowIconResolverListener;
    private boolean layoutRequested = false;
    ArrayList<View> children = new ArrayList<>();

    public ToolbarView(Context context) {
        super(context);
        setLayoutParams(new AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.MATCH_PARENT));
        defaultTitleTextColor = getDefaultTitleTextColor();
        defaultOverflowIcon = getOverflowIcon();
        logoResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                setLogo(d);
                setTintColor(getLogo());
            }
        };
        navIconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                setNavigationIcon(d);
                setTintColor(getNavigationIcon());
                for (int i = 0; i < getChildCount();  i++) {
                    View child = getChildAt(i);
                    if (child instanceof AppCompatImageButton) {
                        child.setTag(navigationTestID);
                    }
                }
            }
        };
        overflowIconResolverListener = new IconResolver.IconResolverListener() {
            @Override
            public void setDrawable(Drawable d) {
                setOverflowIcon(d);
                setTintColor(getOverflowIcon());
            }
        };
        setNavigationOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onNavigationPress", null);
            }
        });
        setOnMenuItemClickListener(new OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                for (int i = 0; i < children.size(); i++) {
                    if (children.get(i) instanceof BarButtonView) {
                        BarButtonView barButtonView = (BarButtonView) children.get(i);
                        if (barButtonView.getMenuItem() != item)
                            barButtonView.getMenuItem().collapseActionView();
                        else
                            barButtonView.press();
                    }
                }
                return true;
            }
        });
    }

    private int getDefaultTitleTextColor() {
        Resources.Theme theme = getContext().getTheme();
        TypedArray toolbarStyle = theme.obtainStyledAttributes(new int[] {getIdentifier(getContext(), "toolbarStyle")});
        int toolbarStyleResId = toolbarStyle.getResourceId(0, 0);
        toolbarStyle.recycle();
        TypedArray textAppearances = theme.obtainStyledAttributes(toolbarStyleResId, new int[] {getIdentifier(getContext(), "titleTextAppearance")});
        int titleTextAppearanceResId = textAppearances.getResourceId(0, 0);
        textAppearances.recycle();
        TypedArray titleTextAppearance = theme.obtainStyledAttributes(titleTextAppearanceResId, new int[]{android.R.attr.textColor});
        int titleTextColor = titleTextAppearance.getColor(0, Color.BLACK);
        titleTextAppearance.recycle();
        return titleTextColor;
    }

    private static int getIdentifier(Context context, String name) {
        return context.getResources().getIdentifier(name, "attr", context.getPackageName());
    }

    void setPlainTitle(String title) {
        this.title = title;
        titleChanged = true;
    }

    void setTitleFontFamily(String titleFontFamily) {
        this.titleFontFamily = titleFontFamily;
        titleChanged = true;
    }

    void setTitleFontWeight(String titleFontWeight) {
        this.titleFontWeight = titleFontWeight;
        titleChanged = true;
    }

    void setTitleFontStyle(String titleFontStyle) {
        this.titleFontStyle = titleFontStyle;
        titleChanged = true;
    }

    void setTitleFontSize(Integer titleFontSize) {
        this.titleFontSize = titleFontSize;
        titleChanged = true;
    }

    void setLogoSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, logoResolverListener, getContext());
    }

    void setNavIconSource(@Nullable ReadableMap source) {
        IconResolver.setIconSource(source, navIconResolverListener, getContext());
    }

    void setOverflowIconSource(@Nullable ReadableMap source) {
        if (source != null)
            IconResolver.setIconSource(source, overflowIconResolverListener, getContext());
        else
            setOverflowIcon(defaultOverflowIcon);
    }

    void setTintColor(Integer tintColor) {
        this.tintColor = tintColor;
        setTintColor(getNavigationIcon());
        setTintColor(getLogo());
        setTintColor(getOverflowIcon());
        setMenuTintColor();
        setCollapseSearchTintColor();
    }

    private void setTintColor(Drawable icon) {
        if (icon != null) {
            if (tintColor != null)
                icon.setColorFilter(tintColor, PorterDuff.Mode.SRC_IN);
            else
                icon.clearColorFilter();
        }
    }

    void setNavigationTestID(String navigationTestID) {
        this.navigationTestID = navigationTestID;
    }

    void setOverflowTestID(String overflowTestID) {
        this.overflowTestID = overflowTestID;
    }

    void setMenuItems() {
        getMenu().clear();
        ArrayList<BarButtonView> visibleBarButtons = new ArrayList<>();
        for (int i = 0; i < children.size(); i++) {
            if (children.get(i) instanceof BarButtonView) {
                BarButtonView barButton = (BarButtonView) children.get(i);
                MenuItem menuItem = getMenu().add(Menu.NONE, Menu.NONE, i, "");
                barButton.setMenuItem(menuItem);
                if (barButton.getShowAsAction() != MenuItem.SHOW_AS_ACTION_NEVER) {
                    visibleBarButtons.add(barButton);
                }
                if (barButton.getSearch()) {
                    searchMenuItem = menuItem;
                    if (onSearchAddedListener != null)
                        onSearchAddedListener.onSearchAdd(searchMenuItem);
                    menuItem.setOnActionExpandListener(new MenuItem.OnActionExpandListener() {
                        @Override
                        public boolean onMenuItemActionCollapse(MenuItem item) {
                            onSearchAddedListener.onSearchCollapse();
                            return true;
                        }

                        @Override
                        public boolean onMenuItemActionExpand(MenuItem item) {
                            onSearchAddedListener.onSearchExpand();
                            return true;
                        }
                    });
                }
            }
        }
        setMenuTestIDs(visibleBarButtons);
        setMenuTintColor();
        requestLayout();
    }

    private void setMenuTintColor()  {
        ActionMenuView menu = getMenuView();
        if (menu != null) {
            for (int j = 0; j < menu.getChildCount(); j++) {
                if (menu.getChildAt(j) instanceof ActionMenuItemView) {
                    ActionMenuItemView menuItem = (ActionMenuItemView) menu.getChildAt(j);
                    if (defaultMenuTintColor == null)
                        defaultMenuTintColor = menuItem.getCurrentTextColor();
                    menuItem.setTextColor(tintColor != null ? tintColor : defaultMenuTintColor);
                }
            }
        }
        for (int i = 0; i < children.size(); i++) {
            if (children.get(i) instanceof BarButtonView) {
                ((BarButtonView) children.get(i)).setTintColor(tintColor);
            }
        }
    }

    private void setMenuTestIDs(ArrayList<BarButtonView> visibleBarButtons) {
        ActionMenuView menuView = getMenuView();
        if (menuView != null) {
            View overflowButton = null;
            ArrayList<View> actionButtons = new ArrayList<>();
            for (int j = 0; j < menuView.getChildCount(); j++) {
                View subchild = ((ActionMenuView) menuView).getChildAt(j);
                if (subchild instanceof AppCompatImageView) {
                    overflowButton = subchild;
                }
                if (subchild instanceof ActionMenuItemView) {
                    actionButtons.add(subchild);
                }
            }
            if (overflowButton != null) {
                overflowButton.setTag(overflowTestID);
            }
            while (visibleBarButtons.size() > actionButtons.size()) {
                int lastIfRoomIndex = visibleBarButtons.size() - 1;
                for (int j = visibleBarButtons.size() - 1; j > 0; j--) {
                    if (visibleBarButtons.get(j).getShowAsAction() == MenuItem.SHOW_AS_ACTION_IF_ROOM) {
                        lastIfRoomIndex = j;
                        break;
                    }
                }
                visibleBarButtons.remove(lastIfRoomIndex);
            }
            for (int j = 0; j < visibleBarButtons.size(); j++) {
                View menuItem = menuView.getChildAt(j);
                if (menuItem instanceof ActionMenuItemView)
                    menuItem.setTag(visibleBarButtons.get(j).getTestID());
            }
        }
    }

    private ActionMenuView getMenuView() {
        for (int i = 0; i < getChildCount(); i++) {
            if (getChildAt(i) instanceof ActionMenuView) {
                return (ActionMenuView) getChildAt(i);
            }
        }
        return null;
    }

    void styleTitle() {
        if (titleChanged) {
            SpannableString titleSpannable = null;
            if (title != null) {
                titleSpannable = new SpannableString(title);
                if (titleFontFamily != null)
                    titleSpannable.setSpan(new TypefaceSpan(titleFontFamily), 0, title.length(), 0);
                if (titleFontWeight != null)
                    titleSpannable.setSpan(new StyleSpan(ReactTypefaceUtils.parseFontWeight(titleFontWeight)), 0, title.length(), 0);
                if (titleFontStyle != null)
                    titleSpannable.setSpan(new StyleSpan(ReactTypefaceUtils.parseFontStyle(titleFontStyle)), 0, title.length(), 0);
                if (titleFontSize != null)
                    titleSpannable.setSpan(new AbsoluteSizeSpan(titleFontSize, true), 0, title.length(), 0);
            }
            setTitle(titleSpannable);
            titleChanged = false;
        }
    }

    void setOnSearchListener(OnSearchListener onSearchListener) {
        this.onSearchAddedListener = onSearchListener;
        if (searchMenuItem != null)
            this.onSearchAddedListener.onSearchAdd(searchMenuItem);

    }

    void setCollapseButton(ImageButton collapseButton) {
        this.collapseButton = collapseButton;
        setCollapseSearchTintColor();
    }

    void setCollapseSearchTintColor() {
        if (collapseButton != null) {
            if (tintColor != null)
                collapseButton.setColorFilter(tintColor);
            else
                collapseButton.clearColorFilter();
        }
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        if (!layoutRequested) {
            layoutRequested = true;
            post(measureAndLayout);
        }
    }

    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
            layoutRequested = false;
            measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };

    interface OnSearchListener {
        void onSearchAdd(MenuItem searchMenuItem);
        void onSearchExpand();
        void onSearchCollapse();
    }
}
