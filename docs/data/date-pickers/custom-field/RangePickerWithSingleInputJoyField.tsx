import * as React from 'react';
import { Dayjs } from 'dayjs';
import {
  useTheme as useMaterialTheme,
  useColorScheme as useMaterialColorScheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
} from '@mui/material/styles';
import {
  extendTheme as extendJoyTheme,
  useColorScheme,
  CssVarsProvider,
  THEME_ID,
} from '@mui/joy/styles';
import { useSlotProps } from '@mui/base/utils';
import Input, { InputProps } from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import { DateRangeIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRangePicker,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import {
  unstable_useSingleInputDateRangeField as useSingleInputDateRangeField,
  SingleInputDateRangeFieldProps,
} from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { useClearableField } from '@mui/x-date-pickers/hooks';
import type {
  SingleInputDateRangeFieldSlots,
  SingleInputDateRangeFieldSlotProps,
} from '@mui/x-date-pickers-pro/SingleInputDateRangeField/SingleInputDateRangeField.types';

const joyTheme = extendJoyTheme();

interface JoyFieldProps extends InputProps {
  label?: React.ReactNode;
  InputProps?: {
    ref?: React.Ref<any>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
}

type JoyFieldComponent = ((
  props: JoyFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const JoyField = React.forwardRef(
  (props: JoyFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      disabled,
      id,
      label,
      InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
      endDecorator,
      startDecorator,
      slotProps,
      ...other
    } = props;

    return (
      <FormControl disabled={disabled} id={id} sx={{ minWidth: 350 }} ref={ref}>
        <FormLabel>{label}</FormLabel>
        <Input
          ref={ref}
          disabled={disabled}
          startDecorator={
            <React.Fragment>
              {startAdornment}
              {startDecorator}
            </React.Fragment>
          }
          endDecorator={
            <React.Fragment>
              {endAdornment}
              {endDecorator}
            </React.Fragment>
          }
          slotProps={{
            ...slotProps,
            root: { ...slotProps?.root, ref: containerRef },
          }}
          {...other}
        />
      </FormControl>
    );
  },
) as JoyFieldComponent;

interface JoySingleInputDateRangeFieldProps
  extends SingleInputDateRangeFieldProps<Dayjs, InputProps> {
  onAdornmentClick?: () => void;
}

type JoySingleInputDateRangeFieldComponent = ((
  props: JoySingleInputDateRangeFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { fieldType?: string };

const JoySingleInputDateRangeField = React.forwardRef(
  (props: JoySingleInputDateRangeFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const { slots, slotProps, onAdornmentClick, ...other } = props;

    const {
      inputRef: externalInputRef,
      ...textFieldProps
    }: SingleInputDateRangeFieldProps<
      Dayjs,
      JoyFieldProps & { inputRef: React.Ref<HTMLInputElement> }
    > = useSlotProps({
      elementType: FormControl,
      externalSlotProps: slotProps?.textField,
      externalForwardedProps: other,
      ownerState: props as any,
    });

    const {
      onClear,
      clearable,
      ref: inputRef,
      ...fieldProps
    } = useSingleInputDateRangeField<Dayjs, JoyFieldProps>({
      props: textFieldProps,
      inputRef: externalInputRef,
    });

    /* If you don't need a clear button, you can skip the use of this hook */
    const { InputProps: ProcessedInputProps, fieldProps: processedFieldProps } =
      useClearableField<
        {},
        typeof textFieldProps.InputProps,
        SingleInputDateRangeFieldSlots,
        SingleInputDateRangeFieldSlotProps<Dayjs>
      >({
        onClear,
        clearable,
        fieldProps,
        InputProps: fieldProps.InputProps,
        slots: { ...slots, clearButton: IconButton },
        slotProps: { ...slotProps, clearIcon: { color: 'action' } },
      });

    return (
      <JoyField
        {...processedFieldProps}
        ref={ref}
        slotProps={{
          input: {
            ref: inputRef,
          },
        }}
        endDecorator={
          <IconButton
            onClick={onAdornmentClick}
            variant="plain"
            color="neutral"
            sx={{ marginLeft: 2.5 }}
          >
            <DateRangeIcon color="action" />
          </IconButton>
        }
        InputProps={{ ...ProcessedInputProps }}
      />
    );
  },
) as JoySingleInputDateRangeFieldComponent;

JoySingleInputDateRangeField.fieldType = 'single-input';

const JoySingleInputDateRangePicker = React.forwardRef(
  (props: DateRangePickerProps<Dayjs>, ref: React.Ref<HTMLDivElement>) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleOpen = (event: React.PointerEvent) => {
      // allows toggle behavior
      event.stopPropagation();
      setIsOpen((currentOpen) => !currentOpen);
    };

    const handleOpen = () => setIsOpen(true);

    const handleClose = () => setIsOpen(false);

    return (
      <DateRangePicker
        {...props}
        ref={ref}
        open={isOpen}
        onClose={handleClose}
        onOpen={handleOpen}
        slots={{ field: JoySingleInputDateRangeField }}
        slotProps={{
          ...props?.slotProps,
          field: {
            ...props?.slotProps?.field,
            onAdornmentClick: toggleOpen,
          } as any,
        }}
      />
    );
  },
);

/**
 * This component is for syncing the theme mode of this demo with the MUI docs mode.
 * You might not need this component in your project.
 */
function SyncThemeMode({ mode }: { mode: 'light' | 'dark' }) {
  const { setMode } = useColorScheme();
  const { setMode: setMaterialMode } = useMaterialColorScheme();
  React.useEffect(() => {
    setMode(mode);
    setMaterialMode(mode);
  }, [mode, setMode, setMaterialMode]);
  return null;
}

export default function RangePickerWithSingleInputJoyField() {
  const materialTheme = useMaterialTheme();
  return (
    <MaterialCssVarsProvider>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode mode={materialTheme.palette.mode} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoySingleInputDateRangePicker
            slotProps={{
              field: { clearable: true },
            }}
          />
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
