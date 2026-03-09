import classNames from "classnames";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/Button";
import { Icon, Icons } from "@/components/Icon";
import {
  SavedCustomTheme,
  usePreviewThemeStore,
  useThemeStore,
} from "@/stores/theme";
import {
  primaryOptions,
  secondaryOptions,
  tertiaryOptions,
} from "@themes/custom";

import { OverlayPortal } from "./OverlayDisplay";

function ColorOption({
  opt,
  selected,
  onClick,
  colorKey1,
  colorKey2,
}: {
  opt: any;
  selected: boolean;
  onClick: () => void;
  colorKey1: string;
  colorKey2?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-300 ease-out outline-none",
        selected
          ? "ring-2 ring-white ring-offset-4 ring-offset-background-main scale-100 shadow-xl shadow-white/10"
          : "hover:scale-110 opacity-60 hover:opacity-100 shadow-lg",
      )}
    >
      <div className="absolute inset-0 flex">
        <div
          className="flex-1 h-full"
          style={{
            backgroundColor: opt.colors[colorKey1]
              ? `rgb(${opt.colors[colorKey1]})`
              : "transparent",
          }}
        />
        {colorKey2 && opt.colors[colorKey2] && (
          <div
            className="flex-1 h-full"
            style={{ backgroundColor: `rgb(${opt.colors[colorKey2]})` }}
          />
        )}
      </div>
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Icon
            icon={Icons.CHECKMARK}
            className="text-white text-2xl drop-shadow-md"
          />
        </div>
      )}
    </button>
  );
}

export function CustomThemeModal(props: {
  id: string;
  isShown: boolean;
  onHide: () => void;
  themeToEdit?: SavedCustomTheme | null;
  onSave?: (theme: SavedCustomTheme) => void;
}) {
  const { t } = useTranslation();

  const saveCustomTheme = useThemeStore((s) => s.saveCustomTheme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const setCustomTheme = useThemeStore((s) => s.setCustomTheme);
  const setPreviewTheme = usePreviewThemeStore((s) => s.setPreviewTheme);

  const [name, setName] = useState("");
  const [primary, setPrimary] = useState(primaryOptions[0].id);
  const [secondary, setSecondary] = useState(secondaryOptions[0].id);
  const [tertiary, setTertiary] = useState(tertiaryOptions[0].id);

  const [wasShown, setWasShown] = useState(false);

  if (props.isShown && !wasShown) {
    setWasShown(true);
    if (props.themeToEdit) {
      setName(props.themeToEdit.name);
      setPrimary(props.themeToEdit.primary);
      setSecondary(props.themeToEdit.secondary);
      setTertiary(props.themeToEdit.tertiary);
    } else {
      setName("");
      setPrimary(primaryOptions[0].id);
      setSecondary(secondaryOptions[0].id);
      setTertiary(tertiaryOptions[0].id);
    }
  } else if (!props.isShown && wasShown) {
    setWasShown(false);
  }

  // Sync state to the preview theme in real-time
  useEffect(() => {
    if (props.isShown) {
      setPreviewTheme("custom");
      setCustomTheme({ primary, secondary, tertiary });
    } else {
      setPreviewTheme(null);
    }
  }, [
    props.isShown,
    primary,
    secondary,
    tertiary,
    setPreviewTheme,
    setCustomTheme,
  ]);

  const handleClose = () => {
    props.onHide();
  };

  const handleSave = () => {
    const themeName = name.trim() || "Untitled Theme";
    const id = props.themeToEdit
      ? props.themeToEdit.id
      : `custom-${Date.now()}`;
    const newTheme: SavedCustomTheme = {
      id,
      name: themeName,
      primary,
      secondary,
      tertiary,
    };

    if (props.onSave) {
      props.onSave(newTheme);
    } else {
      saveCustomTheme(newTheme);
      setTheme(id);
    }

    props.onHide();
  };

  return (
    <OverlayPortal show={props.isShown}>
      <div className="absolute inset-0 z-[1000] flex flex-col md:flex-row bg-background-main/95 backdrop-blur-3xl text-white pointer-events-auto overflow-hidden">
        {/* Left/Top Section - Typography & Actions */}
        <div className="flex-1 flex flex-col p-8 md:p-16 border-b md:border-b-0 md:border-r border-white/5 relative">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white uppercase flex flex-wrap gap-x-3 md:block">
              <span>
                {props.themeToEdit
                  ? t("settings.appearance.customTheme.editBtn", "Edit")
                  : t("settings.appearance.customTheme.createBtn", "Create")}
              </span>
              <br className="hidden md:block" />
              <span>
                {t(
                  "settings.appearance.customTheme.createBtn2",
                  "Your Own Theme",
                )}
              </span>
            </h1>
          </div>

          <div className="flex-1 flex flex-col justify-center my-6 md:my-0 h-full">
            <input
              type="text"
              id="theme-name-input"
              name="theme-name"
              className="w-full text-3xl md:text-4xl lg:text-5xl font-black bg-transparent border-none outline-none text-white placeholder-white/20 transition-colors min-w-0"
              placeholder={t(
                "settings.appearance.customTheme.namePlaceholder",
                "Name your theme...",
              )}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 mt-auto w-full">
            <Button
              className="w-full md:w-auto md:flex-1 !bg-white/5 hover:!bg-white/10 !text-white !font-bold !px-8 !py-5 !rounded-2xl transition-all text-lg"
              onClick={handleClose}
            >
              {t("global.cancel", "Cancel")}
            </Button>
            <Button
              className="w-full md:w-auto md:flex-[2] !bg-white hover:!bg-gray-200 !text-black !font-black !px-12 !py-5 !rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 text-lg shadow-2xl shadow-white/10"
              onClick={handleSave}
              disabled={name.trim().length === 0}
            >
              {t("global.save", "Save")}
            </Button>
          </div>
        </div>

        {/* Right/Bottom Section - Colors */}
        <div className="w-full md:w-[50%] lg:w-[45%] flex flex-col gap-12 p-8 md:p-16 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {t("settings.appearance.customParts.primary", "Primary")} Color
              </h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {primaryOptions.map((opt) => (
                <ColorOption
                  key={opt.id}
                  opt={opt}
                  selected={primary === opt.id}
                  onClick={() => setPrimary(opt.id)}
                  colorKey1="--colors-type-logo"
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {t("settings.appearance.customParts.secondary", "Secondary")}{" "}
                Color
              </h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {secondaryOptions.map((opt) => (
                <ColorOption
                  key={opt.id}
                  opt={opt}
                  selected={secondary === opt.id}
                  onClick={() => setSecondary(opt.id)}
                  colorKey1="--colors-type-text"
                  colorKey2="--colors-buttons-secondary"
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {t("settings.appearance.customParts.tertiary", "Tertiary")}{" "}
                Color
              </h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {tertiaryOptions.map((opt) => (
                <ColorOption
                  key={opt.id}
                  opt={opt}
                  selected={tertiary === opt.id}
                  onClick={() => setTertiary(opt.id)}
                  colorKey1="--colors-themePreview-primary"
                  colorKey2="--colors-themePreview-secondary"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </OverlayPortal>
  );
}
