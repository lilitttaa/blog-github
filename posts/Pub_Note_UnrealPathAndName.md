---
title: Unreal Path And Name
---

## PackageName

```cpp
FString FileName = "C:/MainDic/unrealengine/Engine/Content/Animation/DefaultAnimBoneCompressionSettings.uasset";
FString LongPackageName = FPackageName::FilenameToLongPackageName(FileName);
FString ShortName = FPackageName::GetShortName(LongPackageName);
FString LongPackagePath = FPackageName::GetLongPackagePath(LongPackageName);
FString LongPackageAssetName = FPackageName::GetLongPackageAssetName(LongPackageName);
UE_LOG(LogAssetTool, Display, TEXT("FileName: %s"), *FileName);
UE_LOG(LogAssetTool, Display, TEXT("LongPackageName: %s"), *LongPackageName);
UE_LOG(LogAssetTool, Display, TEXT("ShortName: %s"), *ShortName);
UE_LOG(LogAssetTool, Display, TEXT("LongPackagePath: %s"), *LongPackagePath);
UE_LOG(LogAssetTool, Display, TEXT("LongPackageAssetName: %s"), *LongPackageAssetName);
```

| Type                        | Example                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| FileName                    | C:/MainDic/unrealengine/Engine/Content/Animation/DefaultAnimBoneCompressionSettings.uasset |
| ShortName/ShortPackageName  | DefaultAnimBoneCompressionSettings                                                         |
| PackageName/LongPackageName | /Engine/Animation/DefaultAnimBoneCompressionSettings                                       |
| LongPackageName             | /Engine/Animation/DefaultAnimBoneCompressionSettings                                       |
| LongPackageAssetName        | DefaultAnimBoneCompressionSettings                                                         |
| LongPackagePath             | /Engine/Animation                                                                          |
| ScriptPackageName           |                                                                                            |
| LongScriptPackageName       |                                                                                            |
| TextPath                    |                                                                                            |
| ObjectPath                  |                                                                                            |
| ObjectName                  |                                                                                            |
| FullObjectPath              |                                                                                            |
| NormalizedObjectPath        |                                                                                            |

## Asset

```cpp
UObject* Object = LoadObject<UObject>(nullptr, TEXT("CurveLinearColor'/Game/Asset/Effect/Curve/PostCurve/FX_PostCurve_Fresnel_01.FX_PostCurve_Fresnel_01'"));
FString ObjectPathName = Object->GetPathName();
FString ObjectFullName = Object->GetFullName();
UPackage* Package = Object->GetOutermost();
FString PackagePathName = Package->GetPathName();
FString PackageFullName = Package->GetFullName();
UE_LOG(LogAssetTool, Display, TEXT("ObjectPathName: %s"),*ObjectPathName);
UE_LOG(LogAssetTool, Display, TEXT("ObjectFullName: %s"),*ObjectFullName);
UE_LOG(LogAssetTool, Display, TEXT("PackagePathName: %s"),*PackagePathName);
UE_LOG(LogAssetTool, Display, TEXT("PackageFullName: %s"),*PackageFullName);
```

| Type            | Example                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------- |
| ObjectPathName  | /Game/Asset/Effect/Curve/PostCurve/FX_PostCurve_Fresnel_01.FX_PostCurve_Fresnel_01                  |
| ObjectFullName  | CurveLinearColor /Game/Asset/Effect/Curve/PostCurve/FX_PostCurve_Fresnel_01.FX_PostCurve_Fresnel_01 |
| PackagePathName | /Game/Asset/Effect/Curve/PostCurve/FX_PostCurve_Fresnel_01                                          |
| PackageFullName | Package /Game/Asset/Effect/Curve/PostCurve/FX_PostCurve_Fresnel_01                                  |

## Blueprint

## Reference

- [UE4 C++基础 - 资源常见名词解释](https://zhuanlan.zhihu.com/p/152201635)
- [ObjectPath,PackageName,PackagePath,FileName](https://www.bilibili.com/read/cv35377235/)
